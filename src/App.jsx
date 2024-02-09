import { Button, Input, Form, Table, Spin, Tag, Alert } from 'antd';
import { dateNow } from './utils/moment'
import { id } from './utils/uuid'
import { status } from './utils/status'
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { faArrowsToDot, faCheck } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [addTodoForm] = Form.useForm();
  const [editedNewTodo, setEditedNewTodo] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const todosJSON = localStorage.getItem('todos');
      const savedTodos = todosJSON ? JSON.parse(todosJSON) : [];
      setTodos(savedTodos);
      setLoading(false);
    }, 200);
  }, []);

  const onFinishAddTodo = async (values) => {
    const newTodo = {
      id: id(),
      createdAt: dateNow(),
      status: status.INPROGRESS,
      isCompleted: false,
      ...values
    };


    const updatedTodos = [newTodo, ...todos];
    localStorage.setItem('todos', JSON.stringify(updatedTodos));

    setTodos(updatedTodos);
    addTodoForm.resetFields();
  };

  const setCompleted = async (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });

    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const setNotCompleted = async (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isCompleted: false };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const setFocused = async (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, status: status.FOCUSED };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const setInProgress = async (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, status: status.INPROGRESS };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleStartEdit = async (id) => {
    setEditingTodoId(id);
  };

  const handleEdit = (id, editedNewTodo) => {
    if (editedNewTodo) {
      const updatedTodos = todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, todo: editedNewTodo };
        }
        return todo;
      });
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
    setEditingTodoId(null);
  };

  const handleDelete = async (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    setTodos(updatedTodos);

    if (id === editingTodoId) {
      setEditingTodoId(null);
    }
  };

  const handleChange = (event) => {
    setEditedNewTodo(event.target.value);
  };

  const columns = [
    {
      render: (_, record) => (
        <div className='flex flex-row gap-2 w-8 items-center justify-center'>
          {
            record.isCompleted === false
              ?
              <FontAwesomeIcon className='cursor-pointer text-xl' icon={faSquare} onClick={() => setCompleted(record.id)} />
              :
              <>

                <FontAwesomeIcon className='cursor-pointer text-xl' icon={faSquareCheck} onClick={() => setNotCompleted(record.id)} />
              </>

          }

          {
            (record.status === status.INPROGRESS && record.isCompleted === false) &&
            <LoadingOutlined className='cursor-pointer text-xl text-orange-600' onClick={() => setFocused(record.id)} />
          }

          {
            (record.status === status.FOCUSED && record.isCompleted === false) &&

            <FontAwesomeIcon className='cursor-pointer text-xl text-red-600' icon={faArrowsToDot} onClick={() => setInProgress(record.id)} />
          }
        </div>
      ),
    },
    {
      title: 'Status',
      render: (_, record) => (
        <div className='flex flex-row gap-2 w-20 items-center justify-center'>
          {
            record.isCompleted === true
              ?
              <Tag color="green"> Completed </Tag>
              :
              <>
                {
                  record.status === status.INPROGRESS
                  &&
                  <Tag color="orange"> {record.status} </Tag>
                }

                {
                  record.status === status.FOCUSED
                  &&
                  <Tag color="red"> {record.status} </Tag>
                }
              </>
          }
        </div>
      ),
    },
    {
      title: 'Todo',
      render: (_, record) => (
        <div className='flex flex-row gap-3 items-center'>
          {
            editingTodoId === record.id
              ?
              <>
                <Input defaultValue={record.todo} maxLength={40}  style={{ width: 400 }} onChange={handleChange} />
                <FontAwesomeIcon className='cursor-pointer text-xl' icon={faCheck} shake onClick={() => handleEdit(record.id, editedNewTodo)} />
              </>
              :
              (
                record.isCompleted === true
                  ?
                  <s>{record.todo}</s>
                  :
                  record.todo
              )

          }
        </div>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
    },
    {
      render: (_, record) => (
        <div className='flex flex-row gap-3 w-20 items-center justify-center'>
          {
            editingTodoId
              ?
              <EditOutlined className='text-xl opacity-15' />
              :
              <EditOutlined className='cursor-pointer text-xl ' onClick={() => handleStartEdit(record.id)} />
          }

          <DeleteOutlined className='cursor-pointer text-xl text-red-600' onClick={() => handleDelete(record.id)} />
        </div>
      ),
    },
  ];

  return (
    <div className='flex flex-col justify-center items-center'>
      <Form
        onFinish={onFinishAddTodo}
        className='flex flex-row gap-2 justify-center items-center mt-20'
        form={addTodoForm}
      >
        <Form.Item
          name="todo"
          rules={[{ required: true, message: 'Required todo' },
          { max: 40, message: "Max. 40 characters." },
          ]}
        >
          <Input placeholder='To Do' style={{ width: 400 }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" >
            Add
          </Button>

        </Form.Item>
      </Form>

      {
        loading
          ?
          <Spin size="large" />
          :
          (
            (!loading && todos.length === 0)
              ?
              <Alert message="Todo not found" type="warning" />
              :
              <Table rowKey="id" className="mt-4 max-w-[475px] md:max-w-[750px] xl:max-w-[1200px]" dataSource={todos} columns={columns} />
          )
      }

    </div>
  );
};

export default App;
